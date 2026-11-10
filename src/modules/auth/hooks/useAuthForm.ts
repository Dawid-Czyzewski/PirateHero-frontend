"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { FIX_FIELDS_MESSAGE, SUCCESS_MESSAGE, failureMessage } from "@/modules/auth/authMessages";
import type { AuthResult } from "@/modules/auth/authService";
import {
  validateFields,
  type FieldErrors,
  type FieldValidator,
} from "@/modules/auth/validation";

export type FormStatus = { kind: "idle" } | { kind: "ok" | "err"; text: string };

type FieldValue = string | boolean;

type TextKey<V> = { [P in keyof V]: V[P] extends string ? P : never }[keyof V] & string;

export type TextFieldProps = {
  id: string;
  name: string;
  value: string;
  error: string | undefined;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  ref: (element: HTMLInputElement | null) => void;
};

type UseAuthFormOptions<V extends Record<K, FieldValue>, K extends keyof V & string> = {
  initialValues: V;
  fields: readonly K[];
  validateField: FieldValidator<V, K>;
  dependentFields?: Partial<Record<K, K>>;
  submit: (values: V) => Promise<AuthResult<K>>;
  successRoute: string;
  onSuccess?: (values: V) => void;
};

export type AuthForm<V, K extends keyof V & string> = {
  values: V;
  errors: FieldErrors<K>;
  loading: boolean;
  status: FormStatus;
  setValue: <F extends K>(name: F, value: V[F]) => void;
  validateOnBlur: (name: K) => void;
  fieldRef: (name: K) => (element: HTMLInputElement | null) => void;
  textField: (name: K & TextKey<V>) => TextFieldProps;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
};

const IDLE: FormStatus = { kind: "idle" };

function firstInvalid<K extends string>(fields: readonly K[], errors: FieldErrors<K>): K | undefined {
  return fields.find((name) => errors[name]);
}

export function useAuthForm<V extends Record<K, FieldValue>, K extends keyof V & string>({
  initialValues,
  fields,
  validateField,
  dependentFields = {},
  submit,
  successRoute,
  onSuccess,
}: UseAuthFormOptions<V, K>): AuthForm<V, K> {
  const router = useRouter();
  const [values, setValues] = useState<V>(initialValues);
  const [errors, setErrors] = useState<FieldErrors<K>>({});
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<FormStatus>(IDLE);
  const inputs = useRef<Partial<Record<K, HTMLInputElement | null>>>({});
  const pendingFocus = useRef<K | null>(null);

  useEffect(() => {
    if (!pendingFocus.current) return;
    inputs.current[pendingFocus.current]?.focus();
    pendingFocus.current = null;
  }, [errors]);

  const showErrors = (next: FieldErrors<K>) => {
    pendingFocus.current = firstInvalid(fields, next) ?? null;
    setErrors(next);
    setStatus({ kind: "err", text: FIX_FIELDS_MESSAGE });
  };

  const revalidate = (names: K[], next: V) => {
    const patch: FieldErrors<K> = {};
    for (const name of names) patch[name] = validateField(name, next) || undefined;
    setErrors((prev) => ({ ...prev, ...patch }));
  };

  const setValue = <F extends K>(name: F, value: V[F]) => {
    const next = { ...values, [name]: value };
    setValues(next);
    if (!touched && !errors[name]) return;
    const dependent = dependentFields[name];
    revalidate(dependent && next[dependent] ? [name, dependent] : [name], next);
  };

  const validateOnBlur = (name: K) => {
    if (values[name]) revalidate([name], values);
  };

  const fieldRef = (name: K) => (element: HTMLInputElement | null) => {
    inputs.current[name] = element;
  };

  const textField = (name: K & TextKey<V>): TextFieldProps => ({
    id: name,
    name,
    value: String(values[name]),
    error: errors[name],
    onChange: (event) => setValue(name, event.target.value as V[typeof name]),
    onBlur: () => validateOnBlur(name),
    ref: fieldRef(name),
  });

  const applyResult = (result: AuthResult<K>) => {
    if (result.kind === "success") {
      onSuccess?.(values);
      setStatus({ kind: "ok", text: SUCCESS_MESSAGE });
      router.push(successRoute);
      return;
    }
    setLoading(false);
    if (result.kind === "invalid") showErrors(result.errors);
    else setStatus({ kind: "err", text: failureMessage(result.reason) });
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched(true);
    setStatus(IDLE);
    const validation = validateFields(fields, validateField, values);
    if (!validation.ok) {
      showErrors(validation.errors);
      return;
    }
    setLoading(true);
    applyResult(await submit(values));
  };

  return { values, errors, loading, status, setValue, validateOnBlur, fieldRef, textField, onSubmit };
}
