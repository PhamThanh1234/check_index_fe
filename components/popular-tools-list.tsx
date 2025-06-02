"use client";

import { List, ThemeIcon, Text } from "@mantine/core";
import { IconCircleFilled } from "@tabler/icons-react";
import Link from "next/link";

export function PopularToolsList() {
  const popularTools = [
    { name: "Google Index Checker", href: "/checkindex" },
    { name: "Keyword Clustering", href: "/keywordclustering" },
    { name: "2FA", href: "/checktwofa" },
  ];

  return (
    <List spacing="xs">
      {popularTools.map((tool) => (
        <List.Item
          key={tool.name}
          icon={
            <ThemeIcon color="blue" size={8} radius="xl">
              <IconCircleFilled size={8} />
            </ThemeIcon>
          }
        >
          <Link href={tool.href} style={{ textDecoration: "none" }}>
            <Text size="sm" c="dimmed">
              {tool.name}
            </Text>
          </Link>
        </List.Item>
      ))}
    </List>
  );
}
