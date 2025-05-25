"use client";
import {
  Stack,
  TextInput,
  Title,
  Button,
  Group,
  Transition,
  Loader,
  Tooltip,
} from "@mantine/core";
import { useState, useEffect } from "react";
import { IconCopy } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";

import { CodeBlock } from "./CodeBlock";
export default function PersonForm() {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [image, setImage] = useState("");
  const [sameAs, setSameAs] = useState([""]);
  const [jsonLD, setJsonLD] = useState("");
  const [copyingJson, setCopyingJson] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [copyingHtml, setCopyingHtml] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Person",
      name,
      url,
      image,
      sameAs: sameAs.filter(Boolean),
    };

    setJsonLD(JSON.stringify(schema, null, 2));
  }, [name, url, image, sameAs]);

  const handleSameAsChange = (index: number, value: string) => {
    const updated = [...sameAs];
    updated[index] = value;
    setSameAs(updated);
  };

  const addSameAs = () => setSameAs([...sameAs, ""]);

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
      <Title order={4}>Person Schema</Title>

      <TextInput
        label="Tên"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextInput
        label="URL cá nhân"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <TextInput
        label="Ảnh đại diện (URL)"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      {sameAs.map((link, index) => (
        <TextInput
          key={index}
          label={`Mạng xã hội / SameAs ${index + 1}`}
          value={link}
          onChange={(e) => handleSameAsChange(index, e.target.value)}
          mt="sm"
        />
      ))}
      <Button onClick={addSameAs} variant="light">
        Thêm SameAs
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
