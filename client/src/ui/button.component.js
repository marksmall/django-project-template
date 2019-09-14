import React from 'react';
import styles from './button.module.css';

const Button = ({
  children,
  onClick,
  href,
  disabled = false,
  active,
  padded = true,
  type,
  className,
  ariaLabel
}) => {
  const props = {};
  const classes = [styles.button];
  if (type) classes.push(styles[type]);
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
    <a {...props}>{children}</a>
  ) : (
    <button {...props} disabled={disabled} aria-label={ariaLabel}>
      {children}
    </button>
  );
};

export default Button;
