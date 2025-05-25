"use client";
import {
  Stack,
  TextInput,
  Title,
  Button,
  Group,
  Loader,
  Tooltip,
  Transition,
} from "@mantine/core";
import { useState, useEffect } from "react";
import { IconCopy, IconCheck, IconPlus, IconTrash } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { CodeBlock } from "./CodeBlock";

export default function BreadcrumbForm() {
  const [items, setItems] = useState([
    { name: "Home", url: "https://example.com/" },
    { name: "Blog", url: "https://example.com/blog" },
    { name: "SEO Tips", url: "https://example.com/blog/seo-tips" },
  ]);

  const [jsonLD, setJsonLD] = useState("");
  const [copyingJson, setCopyingJson] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [copyingHtml, setCopyingHtml] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);

  useEffect(() => {
    const itemListElement = items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    }));

    const schema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement,
    };

    setJsonLD(JSON.stringify(schema, null, 2));
  }, [items]);

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

  const updateItem = (index: number, key: "name" | "url", value: string) => {
    const newItems = [...items];
    newItems[index][key] = value;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { name: "", url: "" }]);
  };

  const removeItem = (index: number) => {
    if (index === 0) return; // Không cho xoá mục đầu tiên
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <Stack>
      <Title order={4}>Breadcrumb Schema</Title>

      {items.map((item, index) => (
        <Group key={index} grow align="end">
          <TextInput
            label={`Name ${index + 1}`}
            value={item.name}
            onChange={(e) => updateItem(index, "name", e.target.value)}
          />
          <TextInput
            label={`URL ${index + 1}`}
            value={item.url}
            onChange={(e) => updateItem(index, "url", e.target.value)}
          />
          <Button
            variant="subtle"
            color="red"
            onClick={() => removeItem(index)}
            leftSection={<IconTrash size={16} />}
            disabled={index === 0} // Không cho xoá mục đầu tiên
          >
            Xoá
          </Button>
        </Group>
      ))}

      <Button
        mt="sm"
        variant="light"
        onClick={addItem}
        leftSection={<IconPlus size={16} />}
      >
        Thêm mục
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
