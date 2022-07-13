import { ButtonContainer, ButtonVariants } from "./styles";

interface BquttonProps {
  variant?: ButtonVariants;
}

export function Button({ variant = "primary" }: BquttonProps) {
  return <ButtonContainer variant={variant}>Button</ButtonContainer>;
}
