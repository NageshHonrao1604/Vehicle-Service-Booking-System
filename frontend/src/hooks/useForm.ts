import { useCallback } from 'react';
import { useFormik, FormikHelpers } from 'formik';
import { ObjectSchema } from 'yup';

interface UseFormOptions<T> {
  initialValues: T;
  validationSchema: ObjectSchema<any>;
  onSubmit: (values: T, helpers: FormikHelpers<T>) => Promise<void> | void;
}

export const useForm = <T extends Record<string, any>>({
  initialValues,
  validationSchema,
  onSubmit,
}: UseFormOptions<T>) => {
  const handleSubmit = useCallback(
    async (values: T, helpers: FormikHelpers<T>) => {
      try {
        await onSubmit(values, helpers);
      } catch (error) {
        console.error('Form submission error:', error);
      }
    },
    [onSubmit]
  );

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  return formik;
};
