"use client";
import {
  Stack,
  TextInput,
  Title,
  Button,
  Textarea,
  Group,
  Grid,
  Transition,
  Loader,
  Tooltip,
} from "@mantine/core";
import { useState, useEffect } from "react";
import { IconCopy } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";

import { CodeBlock } from "./CodeBlock";
export default function JobPostingForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [datePosted, setDatePosted] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [hiringOrganizationName, setHiringOrganizationName] = useState("");
  const [hiringOrganizationWebsite, setHiringOrganizationWebsite] =
    useState("");
  const [jobLocationAddress, setJobLocationAddress] = useState("");
  const [salaryCurrency, setSalaryCurrency] = useState("");
  const [salaryValue, setSalaryValue] = useState("");
  const [salaryUnitText, setSalaryUnitText] = useState("");
  const [jsonLD, setJsonLD] = useState("");

  const [copyingJson, setCopyingJson] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [copyingHtml, setCopyingHtml] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);

  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "JobPosting",
      title,
      description,
      datePosted,
      employmentType,
      hiringOrganization: {
        "@type": "Organization",
        name: hiringOrganizationName,
        sameAs: hiringOrganizationWebsite,
      },
      jobLocation: {
        "@type": "Place",
        address: jobLocationAddress,
      },
      baseSalary: {
        "@type": "MonetaryAmount",
        currency: salaryCurrency,
        value: {
          "@type": "QuantitativeValue",
          value: salaryValue,
          unitText: salaryUnitText,
        },
      },
    };

    setJsonLD(JSON.stringify(schema, null, 2));
  }, [
    title,
    description,
    datePosted,
    employmentType,
    hiringOrganizationName,
    hiringOrganizationWebsite,
    jobLocationAddress,
    salaryCurrency,
    salaryValue,
    salaryUnitText,
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
      <Title order={4}>Job Posting Schema</Title>

      <TextInput
        label="Job Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Textarea
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <Grid>
        <Grid.Col span={6}>
          <TextInput
            label="Date Posted"
            value={datePosted}
            onChange={(e) => setDatePosted(e.target.value)}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="Employment Type"
            value={employmentType}
            onChange={(e) => setEmploymentType(e.target.value)}
          />
        </Grid.Col>
      </Grid>

      <TextInput
        label="Hiring Organization Name"
        value={hiringOrganizationName}
        onChange={(e) => setHiringOrganizationName(e.target.value)}
      />
      <TextInput
        label="Hiring Organization Website"
        value={hiringOrganizationWebsite}
        onChange={(e) => setHiringOrganizationWebsite(e.target.value)}
      />

      <TextInput
        label="Job Location Address"
        value={jobLocationAddress}
        onChange={(e) => setJobLocationAddress(e.target.value)}
      />

      <Grid>
        <Grid.Col span={4}>
          <TextInput
            label="Salary Currency"
            value={salaryCurrency}
            onChange={(e) => setSalaryCurrency(e.target.value)}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            label="Salary Value"
            value={salaryValue}
            onChange={(e) => setSalaryValue(e.target.value)}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            label="Salary Unit (e.g., HOUR, MONTH)"
            value={salaryUnitText}
            onChange={(e) => setSalaryUnitText(e.target.value)}
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
