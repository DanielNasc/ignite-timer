import styled, { css } from "styled-components";

export type ButtonVariants = "primary" | "secondary" | "success" | "danger";

interface ButtonContainerProps {
  variant: ButtonVariants;
}

const buttonVariantsColors = {
  primary: "purple",
  secondary: "orange",
  success: "green",
  danger: "red",
};

export const ButtonContainer = styled.button<ButtonContainerProps>`
  width: 100px;
  height: 40px;
  border-radius: 5px;
  border: 0;
  margin: 4px;

  background-color: ${(props) => props.theme[props.variant]};

  /* ${(props) =>
    css`
      background-color: ${buttonVariantsColors[props.variant]};
    `} */
`;
