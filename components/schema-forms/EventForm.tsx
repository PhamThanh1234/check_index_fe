"use client";
import {
  Stack,
  TextInput,
  Title,
  Button,
  Textarea,
  Group,
  Grid,
  Loader,
  Transition,
  Tooltip,
} from "@mantine/core";
import { useState, useEffect } from "react";
import { IconCopy } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";

import { CodeBlock } from "./CodeBlock";
export default function EventForm() {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [locationName, setLocationName] = useState("");
  const [locationAddress, setLocationAddress] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [eventStatus, setEventStatus] = useState("");
  const [eventAttendanceMode, setEventAttendanceMode] = useState("");
  const [organizerName, setOrganizerName] = useState("");
  const [organizerUrl, setOrganizerUrl] = useState("");
  const [jsonLD, setJsonLD] = useState("");
  const [copyingJson, setCopyingJson] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [copyingHtml, setCopyingHtml] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Event",
      name,
      startDate,
      endDate,
      eventAttendanceMode,
      eventStatus,
      location: {
        "@type": "Place",
        name: locationName,
        address: locationAddress,
      },
      image: [image],
      description,
      organizer: {
        "@type": "Organization",
        name: organizerName,
        url: organizerUrl,
      },
    };

    setJsonLD(JSON.stringify(schema, null, 2));
  }, [
    name,
    startDate,
    endDate,
    locationName,
    locationAddress,
    description,
    image,
    eventStatus,
    eventAttendanceMode,
    organizerName,
    organizerUrl,
  ]);

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
      <Title order={4}>Event Schema</Title>

      <TextInput
        label="Event Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Grid>
        <Grid.Col span={6}>
          <TextInput
            label="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </Grid.Col>
      </Grid>
      <Grid>
        <Grid.Col span={6}>
          <TextInput
            label="Event Attendance Mode"
            value={eventAttendanceMode}
            onChange={(e) => setEventAttendanceMode(e.target.value)}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="Event Status"
            value={eventStatus}
            onChange={(e) => setEventStatus(e.target.value)}
          />
        </Grid.Col>
      </Grid>

      <TextInput
        label="Image URL"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Textarea
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Grid>
        <Grid.Col span={6}>
          <TextInput
            label="Location Name"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="Location Address"
            value={locationAddress}
            onChange={(e) => setLocationAddress(e.target.value)}
          />
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={6}>
          <TextInput
            label="Organizer Name"
            value={organizerName}
            onChange={(e) => setOrganizerName(e.target.value)}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="Organizer URL"
            value={organizerUrl}
            onChange={(e) => setOrganizerUrl(e.target.value)}
          />
        </Grid.Col>
      </Grid>
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
