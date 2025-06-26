"use client";

import { Header } from "@/components/header";
import { useState } from "react";
import {
  Container,
  Button,
  Title,
  Text,
  Grid,
  Box,
  AppShell,
  Group,
  Paper,
  Stack,
  Textarea,
  CopyButton,
  Tooltip,
  ActionIcon,
} from "@mantine/core";
import "@mantine/core/styles.css";
import { IconCheck, IconCopy } from "@tabler/icons-react";

const getRandomItem = (items: string[]): string =>
  items[Math.floor(Math.random() * items.length)];

const spinContentFixed = (text: string): string => {
  const fixedMap = new Map<string, string>();

  const doublePattern = /\[\[([^{}]+?)\]\]/;
  const singlePattern = /\{([^{}]+?)\}/;

  const resolve = (str: string): string => {
    let s = str;

    while (true) {
      const dbl = s.match(doublePattern);
      if (dbl) {
        const inner = dbl[1];
        if (!fixedMap.has(inner)) {
          const variants = inner.split("|").map((opt) => resolve(opt.trim()));
          fixedMap.set(inner, getRandomItem(variants));
        }
        s = s.replace(doublePattern, fixedMap.get(inner)!);
        continue;
      }

      const sgl = s.match(singlePattern);
      if (sgl) {
        const inner = sgl[1];
        const variants = inner.split("|").map((opt) => resolve(opt.trim()));
        s = s.replace(singlePattern, getRandomItem(variants));
        continue;
      }

      break;
    }

    if (!s.includes("{") && s.includes("|")) {
      const leftovers = s.split("|").map((opt) => opt.trim());
      s = getRandomItem(leftovers);
    }

    return s;
  };

  return resolve(text);
};

const SpinContent = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);

  const handleSpin = () => {
    if (!inputText.trim()) return;
    setIsSpinning(true);

    setTimeout(() => {
      const result = spinContentFixed(inputText);
      setOutputText(result);
      setIsSpinning(false);
    }, 50);
  };

  return (
    <div>
      <Header />
      <AppShell
        header={{ height: 70 }}
        styles={{
          main: {
            background: "linear-gradient(135deg, #667eea 0%, #0089CF 100%)",
            minHeight: "100vh",
          },
        }}
      >
        <AppShell.Main>
          <Container size="xl" py="xl">
            <Paper
              radius="lg"
              p="xl"
              shadow="xl"
              style={{
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
              }}
            >
              <Stack gap="md">
                <Group justify="space-between" align="center">
                  <Text size="sm" c="dimmed">
                    {inputText.length}/10,000
                  </Text>
                  <Text size="sm" c="dimmed">
                    Text length after: {outputText.length}
                  </Text>
                </Group>

                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Stack gap="sm">
                      <Text fw={500} size="sm" c="dimmed">
                        Your text to rewrite...
                      </Text>
                      <Textarea
                        placeholder="Enter your text here..."
                        value={inputText}
                        onChange={(event) =>
                          setInputText(event.currentTarget.value)
                        }
                        minRows={10}
                        maxRows={100}
                        autosize
                        maxLength={10000}
                        styles={{
                          input: {
                            fontSize: "14px",
                            lineHeight: 1.5,
                          },
                        }}
                      />
                    </Stack>
                  </Grid.Col>

                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Stack gap="sm">
                      <Group justify="space-between">
                        <Text fw={500} size="sm" c="dimmed">
                          Your rewritten text...
                        </Text>
                      </Group>
                      <Textarea
                        placeholder="Your rewritten text will appear here..."
                        value={outputText}
                        minRows={10}
                        maxRows={100}
                        readOnly
                        autosize
                        styles={{
                          input: {
                            fontSize: "14px",
                            lineHeight: 1.5,
                            backgroundColor: "#f8f9fa",
                          },
                        }}
                      />
                    </Stack>
                    <Group mt="xl">
                      <Button
                        variant="gradient"
                        gradient={{ from: "indigo", to: "cyan" }}
                        onClick={handleSpin}
                        loading={isSpinning}
                        disabled={!inputText.trim()}
                      >
                        Spin Now
                      </Button>
                      <CopyButton value={outputText} timeout={2000}>
                        {({ copied, copy }) => (
                          <Tooltip
                            label={copied ? "Copied" : "Copy"}
                            withArrow
                            position="right"
                          >
                            <ActionIcon
                              color={copied ? "teal" : "gray"}
                              variant="subtle"
                              onClick={copy}
                            >
                              {copied ? (
                                <IconCheck size={16} />
                              ) : (
                                <IconCopy size={16} />
                              )}
                            </ActionIcon>
                          </Tooltip>
                        )}
                      </CopyButton>
                    </Group>
                  </Grid.Col>
                </Grid>
              </Stack>
            </Paper>

            <Box mt="xl" ta="center">
              <Title order={1} c="white" mb="sm">
                Intelligent, Free Text Rewriting Tool
              </Title>
              <Text c="white" size="lg" opacity={0.9}>
                Have some fun with it! Discover how SpinBot can enhance your
                writing within seconds.
              </Text>
            </Box>
          </Container>
        </AppShell.Main>
      </AppShell>
    </div>
  );
};

export default SpinContent;
