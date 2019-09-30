import React from 'react';
import styles from './button.module.css';

const Button = ({
  children,
  onClick,
  href,
  disabled = false,
  active,
  padded = true,
  type = 'button',
  shape,
  className,
  ariaLabel,
  dataFor
}) => {
  const props = {};
  const classes = [styles.button];
  if (shape) classes.push(styles[shape]);
  if (className) classes.push(className);
  if (href) {
    props.href = href;
  }
  if (!disabled && onClick) {
    props.onClick = onClick;
  }
  if (disabled) {
    classes.push(styles.disabled);
  }
  if (active) {
    classes.push(styles.active);
  }
  if (!padded) {
    classes.push(styles['no-padding']);
  }

  props.className = classes.join(' ');
  return href ? (
    <a data-tip data-for={dataFor} {...props}>
      {children}
    </a>
  ) : (
    <button type={type} {...props} disabled={disabled} aria-label={ariaLabel} data-tip data-for={dataFor}>
      {children}
    </button>
  );
};

export default Button;
