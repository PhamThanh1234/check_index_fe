"use client";
import {
  Stack,
  Title,
  Button,
  Textarea,
  Group,
  Tooltip,
  Transition,
  Loader,
  TextInput,
  Grid,
  Flex,
} from "@mantine/core";
import { useState, useEffect } from "react";
import { IconCheck, IconCopy, IconTrash } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { CodeBlock } from "./CodeBlock";

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQPageForm() {
  const [questions, setQuestions] = useState<FAQItem[]>([
    { question: "", answer: "" },
  ]);
  const [jsonLD, setJsonLD] = useState("");

  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: questions.map((q) => ({
        "@type": "Question",
        name: q.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: q.answer,
        },
      })),
    };

    setJsonLD(JSON.stringify(schema, null, 2));
  }, [questions]);

  const handleQuestionChange = (
    index: number,
    field: "question" | "answer",
    value: string
  ) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: "", answer: "" }]);
  };

  const removeQuestion = (index: number) => {
    if (index === 0) return;
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const [copyingJson, setCopyingJson] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [copyingHtml, setCopyingHtml] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);

  const handleCopy = async () => {
    setCopyingJson(true);
    try {
      await navigator.clipboard.writeText(jsonLD);
      setCopiedJson(true);
      notifications.show({
        title: "Copied!",
        message: "JSON-LD copied to clipboard.",
        color: "green",
      });
    } catch {
      notifications.show({
        title: "Error",
        message: "Failed to copy.",
        color: "red",
      });
    } finally {
      setCopyingJson(false);
      setTimeout(() => setCopiedJson(false), 1500);
    }
  };

  const handleCopyScript = async () => {
    setCopyingHtml(true);
    try {
      const htmlScript = `<script type="application/ld+json">\n${jsonLD}\n</script>`;
      await navigator.clipboard.writeText(htmlScript);
      setCopiedHtml(true);
      notifications.show({
        title: "Copied!",
        message: "HTML Embed copied to clipboard.",
        color: "green",
      });
    } catch {
      notifications.show({
        title: "Error",
        message: "Failed to copy HTML.",
        color: "red",
      });
    } finally {
      setCopyingHtml(false);
      setTimeout(() => setCopiedHtml(false), 1500);
    }
  };

  return (
    <Stack>
      <Title order={4}>FAQ Page Schema</Title>

      {questions.map((q, i) => (
        <Stack key={i}>
          <Grid>
            <Grid.Col span={10}>
              <TextInput
                label={`Question ${i + 1}`}
                value={q.question}
                onChange={(e) =>
                  handleQuestionChange(i, "question", e.target.value)
                }
              />
              <Textarea
                label={`Answer ${i + 1}`}
                value={q.answer}
                onChange={(e) =>
                  handleQuestionChange(i, "answer", e.target.value)
                }
              />
            </Grid.Col>
            <Grid.Col span={2}>
              <Flex
                h={"100%"}
                gap="md"
                justify="center"
                align="center"
                direction="row"
                wrap="wrap"
              >
                <Button
                  variant="subtle"
                  color="red"
                  onClick={() => removeQuestion(i)}
                  leftSection={<IconTrash size={16} />}
                  disabled={i === 0} // Không cho xoá mục đầu tiên
                >
                  Xoá
                </Button>
              </Flex>
            </Grid.Col>
          </Grid>
        </Stack>
      ))}

      <Button onClick={addQuestion} variant="outline">
        Add Question
      </Button>
      <Group justify="space-between" mt="md">
        <Title order={5}>JSON-LD Preview</Title>
        <Tooltip label={copiedJson ? "Copied!" : "Copy JSON"} withArrow>
          <Button
            size="xs"
            variant="light"
            onClick={handleCopy}
            leftSection={
              copyingJson ? (
                <Loader size="xs" />
              ) : copiedJson ? (
                <Transition
                  mounted
                  transition="pop"
                  duration={200}
                  timingFunction="ease"
                >
                  {(styles) => (
                    <IconCheck size={16} style={styles} color="teal" />
                  )}
                </Transition>
              ) : (
                <IconCopy size={16} />
              )
            }
          >
            {copiedJson ? "Copied" : "Copy JSON"}
          </Button>
        </Tooltip>
      </Group>

      <CodeBlock code={jsonLD} language="json" />

      <Group justify="space-between" mt="md">
        <Title order={5}>HTML Embed (for SEO testing)</Title>
        <Tooltip label={copiedHtml ? "Copied!" : "Copy HTML"} withArrow>
          <Button
            size="xs"
            variant="light"
            onClick={handleCopyScript}
            leftSection={
              copyingHtml ? (
                <Loader size="xs" />
              ) : copiedHtml ? (
                <Transition
                  mounted
                  transition="pop"
                  duration={200}
                  timingFunction="ease"
                >
                  {(styles) => (
                    <IconCheck size={16} style={styles} color="teal" />
                  )}
                </Transition>
              ) : (
                <IconCopy size={16} />
              )
            }
          >
            {copiedHtml ? "Copied" : "Copy HTML"}
          </Button>
        </Tooltip>
      </Group>

      <CodeBlock
        code={`<script type="application/ld+json">\n${jsonLD}\n</script>`}
        language="html"
      />
    </Stack>
  );
}
