"use client"

import { Group, Button, Text, Container, Burger, Drawer, Stack, Switch } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import {  IconMoon, IconSun } from "@tabler/icons-react"
import Link from "next/link"

export function Header() {
  const [opened, { toggle, close }] = useDisclosure(false)

  const navLinks = [
    { label: "Plagiarism Checker", href: "#" },
    { label: "Free Grammar Checker", href: "#" },
    { label: "Authenticator Tool", href: "#" },
    { label: "Paraphrasing Tool", href: "#" },
  ]

  return (
    <header style={{ borderBottom: "1px solid #e9ecef", backgroundColor: "white" }}>
      <Container size="xl">
        <Group justify="space-between" h={60}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
            <Text component="span" fw={700} size="xl">
              Scapbot
            </Text>
            <Text component="span" fw={700} size="xl" c="var(--mantine-primary-color-filled)">
              SEO
            </Text>
            <Text component="span" fw={700} size="xl">
              Tools
            </Text>
          </Link>

          <Group gap="sm" visibleFrom="md" >
            {navLinks.map((link) => (
              <Button key={link.label} variant="subtle" color="gray" component={Link} href={link.href}>
                {link.label}
              </Button>
            ))}

      

          
          </Group>
  <Group gap={5}>
              <Text size="sm">EN</Text>
              <Switch
                size="md"
                onLabel={<IconSun size={16} stroke={2.5} />}
                offLabel={<IconMoon size={16} stroke={2.5} />}
              />
            </Group>
          <Burger opened={opened} onClick={toggle} hiddenFrom="md" />

          <Drawer opened={opened} onClose={close} title="Menu" hiddenFrom="md" position="right">
            <Stack>
            
            </Stack>
          </Drawer>
        </Group>
      </Container>
    </header>
  )
}
