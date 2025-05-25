"use client"

import { List, ThemeIcon, Text } from "@mantine/core"
import { IconCircleFilled } from "@tabler/icons-react"
import Link from "next/link"

export function PopularToolsList() {
  const popularTools = [
    { name: "Google Index Checker", href: "/checkindex" },
    { name: "Paraphrasing Tool", href: "#" },
    { name: "AI Detector", href: "#" },
    { name: "Free Grammar Checker", href: "#" },
    { name: "Reverse Image Search", href: "#" },
    { name: "Logo Maker", href: "#" },
    { name: "Website SEO Score Checker", href: "#" },
    { name: "Emojis", href: "#" },
    { name: "Citation Generator", href: "#" },
    { name: "AI Humanizer", href: "#" },
  ]

  return (
    <List spacing="xs" >
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
  )
}
