import styled from 'styled-components';

type PromptTypes = {
  text: string;
};

export default function GuidePrompt({ text }: PromptTypes) {
  return <Text>{text}</Text>;
}

const Text = styled.p`
  place-self: center;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 800;
  color: HSLA(${(props) => props.theme.colors.secondaryLight}, 1);
  // background: HSLA(${(props) => props.theme.colors.secondary}, 0.25);
  padding: 1rem;
  margin: 1rem;
  // box-shadow: ${(props) => props.theme.shadows.extraSmall};
`;
