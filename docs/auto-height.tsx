import React, { useRef, useState, useEffect } from 'react';
import AnimateHeight, { Height } from '../src/index';

const AutoHeight = ({ children, ...props }) => {
  const [height, setHeight] = useState<Height>('auto');
  const contentDiv = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      setHeight(contentDiv.current.clientHeight);
    });

    resizeObserver.observe(contentDiv.current);
  }, []);

  return (
    <AnimateHeight
      {...props}
      height={height}
      contentClassName="auto-content"
      contentRef={contentDiv}
    >
      {children}
    </AnimateHeight>
  );
};

export default AutoHeight;
