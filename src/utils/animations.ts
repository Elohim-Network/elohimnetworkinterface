
/**
 * Creates a ripple effect at the specified coordinates within an element
 */
export const createRipple = (
  event: React.MouseEvent<HTMLElement>,
  color: string = 'rgba(255, 255, 255, 0.7)'
): void => {
  const button = event.currentTarget;
  const rect = button.getBoundingClientRect();
  
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  const ripple = document.createElement('span');
  ripple.classList.add('ripple');
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  ripple.style.backgroundColor = color;
  
  button.appendChild(ripple);
  
  setTimeout(() => {
    ripple.remove();
  }, 1000);
};

/**
 * Adds a subtle hover animation to an element
 */
export const addHoverAnimation = (
  element: HTMLElement,
  scale: number = 1.05
): void => {
  element.addEventListener('mouseenter', () => {
    element.style.transform = `scale(${scale})`;
    element.style.transition = 'transform 0.3s ease';
  });
  
  element.addEventListener('mouseleave', () => {
    element.style.transform = 'scale(1)';
  });
};

/**
 * Delays an element appearance with a fade in effect
 */
export const staggeredAppear = (
  elements: HTMLElement[],
  delayBetween: number = 100
): void => {
  elements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(10px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, index * delayBetween);
  });
};
