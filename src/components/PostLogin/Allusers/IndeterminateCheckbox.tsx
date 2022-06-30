/* eslint-disable react/display-name */
import React, {forwardRef, useEffect, useRef} from 'react';

interface IIndeterminateInputProps {
  indeterminate?: boolean;
  name: string;
}

const useCombinedRefs = (
  ...refs: Array<React.Ref<HTMLInputElement> | React.MutableRefObject<null>>
): React.MutableRefObject<HTMLInputElement | null> => {
  const targetRef = useRef(null);

  useEffect(() => {
    refs.forEach((ref: React.Ref<HTMLInputElement> | React.MutableRefObject<null>) => {
      if (!ref) return;

      if (typeof ref === 'function') {
        ref(targetRef.current);
      } else {
        ref.current = targetRef.current;
      }
    });
  }, [refs]);

  return targetRef;
};

const IndeterminateCheckbox = forwardRef<HTMLInputElement, IIndeterminateInputProps>(
  ({indeterminate, ...rest}, ref: React.Ref<HTMLInputElement>) => {
    const defaultRef = useRef(null);
    const combinedRef = useCombinedRefs(ref, defaultRef);

    useEffect(() => {
      if (combinedRef?.current) {
        combinedRef.current.indeterminate = indeterminate ?? false;
      }
    }, [combinedRef, indeterminate]);

    return (
      <>
        <input type='checkbox' ref={combinedRef} {...rest} />
      </>
    );
  }
);

export default IndeterminateCheckbox;
