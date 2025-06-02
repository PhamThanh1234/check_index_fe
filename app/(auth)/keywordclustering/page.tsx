"use client";

import {
  Card,
  Title,
  Text,
  Badge,
  Group,
  SimpleGrid,
  List,
  ThemeIcon,
  Stack,
  Paper,
  Textarea,
  Grid,
  Button,
  Loader,
  Overlay,
} from "@mantine/core";
import {
  IconLink,
  IconSearch,
  IconTarget,
  IconTrendingUp,
  IconShield,
  IconArrowRight,
  IconAlertTriangle,
} from "@tabler/icons-react";

import "@mantine/core/styles.css";
import { Header } from "@/components/header";
import { useState } from "react";
import { checkLink } from "@/app/api/keywordclustering";
import * as XLSX from "xlsx";
const iconList = [IconLink, IconSearch, IconTarget, IconTrendingUp, IconShield];
const colorList = ["blue", "green", "orange", "violet", "red"];

function getConsistentIconAndColor(key: string) {
  const hash = [...key].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const icon = iconList[hash % iconList.length];
  const color = colorList[hash % colorList.length];
  return { icon, color };
}

export default function BacklinkGroups() {
  const [listkeyword, setListkeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [groups, setGroups] = useState<
    {
      key: string;
      title: string;
      description: string;
      color: string;
      icon: any;
      keywords: string[];
    }[]
  >([]);

  const normalizeInput = (input: string) => {
    return input
      .replace(/\r/g, "")
      .replace(/\u200B/g, "")
      .replace(/\t/g, "")
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  };

  const handleGroupkeyword = async () => {
    const keywords = normalizeInput(listkeyword);

    if (keywords.length === 0) {
      alert("Vui lòng nhập ít nhất một từ khóa.");
      return;
    }

    setLoading(true);
    const payload = { keywords };

    try {
      const result = await checkLink(payload);
      const input = result.groups;
      const data = input.match(/{[\s\S]*}/);
      const jsonString = data[0];
      const parsed = JSON.parse(jsonString);

      if (parsed && typeof parsed === "object") {
        const processedGroups = Object.entries(parsed).map(
          ([key, value]: any) => {
            const { icon, color } = getConsistentIconAndColor(key);
            const keywordsArray = Array.isArray(value.keywords)
              ? value.keywords
              : [];

            return {
              key,
              title: value.title.split(":")[1] || value.title,
              description: `Nhóm các từ khóa liên quan đến ${value.title}`,
              color,
              icon,
              keywords: keywordsArray,
            };
          }
        );

        setGroups(processedGroups);
      } else {
        console.error("Dữ liệu trả về không hợp lệ:", parsed);
      }
    } catch (error) {
      console.error("Lỗi gửi API:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setListkeyword(text);
      };
      reader.readAsText(file);
    } else {
      alert("Chỉ hỗ trợ file .txt!");
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
  };

  // thêm dòng này ở đầu file nếu chưa có

  const handleDownloadExcel = () => {
    if (!groups.length) {
      setMessage("Chưa có nhóm từ khóa nào để tải xuống.");
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    const excelData = groups.flatMap((group) =>
      group.keywords.map((keyword) => ({
        GroupTitle: group.title,
        Description: group.description,
        Keyword: keyword,
      }))
    );

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Keyword Groups");

    XLSX.writeFile(workbook, "keyword-groups.xlsx");
  };

  return (
    <>
      <Header />
      <Grid>
        <Grid.Col span={3}></Grid.Col>
        <Grid.Col span={6} mt="md">
          <Title mb="md" order={2}>
            Công Cụ Nhóm Từ Khóa
          </Title>
          <Textarea
            placeholder="Copy và dán danh sách keyword vào ô này. Mỗi từ khóa trên 1 dòng"
            label="Danh sách từ khóa"
            autosize
            mt="md"
            value={listkeyword}
            minRows={10}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onChange={(e) => setListkeyword(e.currentTarget.value)}
          />
          <Group justify="end" mt="md">
            <Button
              variant="light"
              mb="md"
              size="sm"
              rightSection={<IconArrowRight size={14} />}
              onClick={handleGroupkeyword}
            >
              Group Keyword
            </Button>
          </Group>
          <Paper shadow="xs" p="md" withBorder className="bg-custom-box">
            <Stack gap="xl">
              <div>
                <Title order={1} mb="sm">
                  Phân tích Dữ liệu
                </Title>
                <Text size="lg" c="dimmed">
                  Tổng quan các nhóm từ khóa liên quan
                </Text>
                <Group justify="space-between" mt="sm">
                  <Button
                    variant="outline"
                    color="blue"
                    size="xs"
                    onClick={handleDownloadExcel}
                  >
                    Tải xuống Excel
                  </Button>
                  {message && (
                    <Text c="red" mt="xs" size="sm">
                      <IconAlertTriangle />
                      {message}
                    </Text>
                  )}
                </Group>
              </div>

              <Paper p="md" withBorder>
                <Group mb="md">
                  <Badge size="lg" variant="light">
                    Tổng cộng: {groups.length} nhóm
                  </Badge>
                  <Badge size="lg" variant="light" color="green">
                    {groups.reduce(
                      (total, group) => total + group.keywords.length,
                      0
                    )}{" "}
                    từ khóa
                  </Badge>
                </Group>
              </Paper>

              <div style={{ position: "relative" }}>
                {loading && (
                  <>
                    <Overlay opacity={0.6} blur={2} zIndex={5} />
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        zIndex: 10,
                        transform: "translate(-50%, -50%)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Loader color="blue" size="lg" />
                      <Text mt="sm" fw={500}>
                        Đang gom nhóm từ khóa...
                      </Text>
                    </div>
                  </>
                )}

                <SimpleGrid
                  cols={{ base: 1, sm: 2, lg: 2 }}
                  spacing="xl"
                  verticalSpacing="xl"
                  style={{
                    opacity: loading ? 0.5 : 1,
                    transition: "opacity 0.3s",
                  }}
                >
                  {groups.map((group) => {
                    const IconComponent = group.icon;
                    return (
                      <Card
                        key={group.key}
                        shadow="sm"
                        padding="lg"
                        radius="md"
                        withBorder
                        h="100%"
                      >
                        <Card.Section withBorder inheritPadding py="xs">
                          <Group justify="space-between">
                            <Group gap="xs">
                              <ThemeIcon
                                color={group.color}
                                variant="light"
                                size="lg"
                              >
                                <IconComponent size={20} />
                              </ThemeIcon>
                              <Text fw={600} size="lg">
                                {group.title}
                              </Text>
                              <div>
                                <Text size="sm" c="dimmed">
                                  {group.description}
                                </Text>
                              </div>
                            </Group>
                            <Badge color={group.color} variant="light">
                              {group.keywords.length} từ khóa
                            </Badge>
                          </Group>
                        </Card.Section>

                        <Stack gap="md" mt="md">
                          <List spacing="xs" size="sm">
                            {group.keywords.map(
                              (keyword: string, index: number) => (
                                <List.Item key={index}>
                                  <Text size="sm">{keyword}</Text>
                                </List.Item>
                              )
                            )}
                          </List>
                        </Stack>
                      </Card>
                    );
                  })}
                </SimpleGrid>
              </div>
            </Stack>
          </Paper>

          <Text></Text>
        </Grid.Col>
        <Grid.Col span={3}></Grid.Col>
      </Grid>
    </>
  );
}
