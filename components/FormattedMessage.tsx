import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface FormattedMessageProps {
  text: string;
  style?: any;
  isDarkMode?: boolean;
}

/**
 * Componente que renderiza texto com suporte a:
 * - **texto** para negrito
 * - Quebras de linha
 * - Melhor formatação de mensagens
 */
export const FormattedMessage: React.FC<FormattedMessageProps> = ({
  text,
  style,
  isDarkMode = false,
}) => {
  // Processa o texto para encontrar **negrito**
  const parseText = (input: string) => {
    const parts: React.ReactNode[] = [];
    const regex = /\*\*(.*?)\*\*/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(input)) !== null) {
      // Adiciona texto normal antes do negrito
      if (match.index > lastIndex) {
        const normalText = input.slice(lastIndex, match.index);
        parts.push(
          <Text key={`normal-${lastIndex}`} style={style}>
            {normalText}
          </Text>
        );
      }

      // Adiciona texto em negrito
      parts.push(
        <Text
          key={`bold-${match.index}`}
          style={[style, styles.bold]}
        >
          {match[1]}
        </Text>
      );

      lastIndex = regex.lastIndex;
    }

    // Adiciona texto normal restante
    if (lastIndex < input.length) {
      parts.push(
        <Text key={`normal-end`} style={style}>
          {input.slice(lastIndex)}
        </Text>
      );
    }

    return parts.length > 0 ? parts : input;
  };

  // Divide o texto em linhas e processa cada uma
  const lines = text.split('\n');

  return (
    <View>
      {lines.map((line, index) => (
        <Text
          key={`line-${index}`}
          style={[
            style,
            {
              marginBottom: index < lines.length - 1 ? 4 : 0,
            },
          ]}
        >
          {parseText(line)}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  bold: {
    fontWeight: '700',
  },
});
