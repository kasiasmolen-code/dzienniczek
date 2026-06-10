import React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Button } from './button'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Button',
    variant: 'default',
    size: 'default',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'outline', 'ghost', 'destructive'],
    },
    size: {
      control: 'select',
      options: ['xs', 'default', 'sm', 'lg', 'xl', '2xl', 'icon'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {}

export const Hover: Story = {
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button')
    button?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
  },
}

export const Focus: Story = {
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button')
    button?.focus()
  },
}

export const Disabled: Story = {
  args: { disabled: true },
}

const darkWrapper = (Story: React.ComponentType) => (
  <div className="dark inline-flex bg-[#0A0A0A] p-8">
    <Story />
  </div>
)

export const SecondaryDefault: Story = {
  name: 'Secondary / Default',
  args: { variant: 'secondary', size: 'lg', children: 'Label' },
  decorators: [darkWrapper],
}

export const SecondaryHover: Story = {
  name: 'Secondary / Hover',
  args: { variant: 'secondary', size: 'lg', children: 'Label' },
  decorators: [darkWrapper],
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button')
    button?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
  },
}

export const SecondaryFocus: Story = {
  name: 'Secondary / Focus',
  args: { variant: 'secondary', size: 'lg', children: 'Label' },
  decorators: [darkWrapper],
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button')
    button?.focus()
  },
}

export const SecondaryDisabled: Story = {
  name: 'Secondary / Disabled',
  args: { variant: 'secondary', size: 'lg', children: 'Label', disabled: true },
  decorators: [darkWrapper],
}

export const DestructiveDefault: Story = {
  name: 'Destructive / Default',
  args: { variant: 'destructive', size: 'lg', children: 'Label' },
  decorators: [darkWrapper],
}

export const DestructiveHover: Story = {
  name: 'Destructive / Hover',
  args: { variant: 'destructive', size: 'lg', children: 'Label' },
  decorators: [darkWrapper],
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button')
    button?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
  },
}

export const DestructiveFocus: Story = {
  name: 'Destructive / Focus',
  args: { variant: 'destructive', size: 'lg', children: 'Label' },
  decorators: [darkWrapper],
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button')
    button?.focus()
  },
}

export const DestructiveDisabled: Story = {
  name: 'Destructive / Disabled',
  args: { variant: 'destructive', size: 'lg', children: 'Label', disabled: true },
  decorators: [darkWrapper],
}

export const GhostDefault: Story = {
  name: 'Ghost / Default',
  args: { variant: 'ghost', size: 'lg', children: 'Label' },
  decorators: [darkWrapper],
}

export const GhostHover: Story = {
  name: 'Ghost / Hover',
  args: { variant: 'ghost', size: 'lg', children: 'Label' },
  decorators: [darkWrapper],
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button')
    button?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
  },
}

export const GhostFocus: Story = {
  name: 'Ghost / Focus',
  args: { variant: 'ghost', size: 'lg', children: 'Label' },
  decorators: [darkWrapper],
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button')
    button?.focus()
  },
}

export const GhostDisabled: Story = {
  name: 'Ghost / Disabled',
  args: { variant: 'ghost', size: 'lg', children: 'Label', disabled: true },
  decorators: [darkWrapper],
}

// ─── Navigation Patterns ─────────────────────────────────────────────────────
// Standard: każdy przycisk "wstecz" w aplikacji MUSI wyglądać jak poniżej.

export const BackButton: Story = {
  name: 'Pattern / Back Button',
  args: { variant: 'ghost', size: 'default' },
  render: () => (
    <Button variant="ghost" size="default">
      <ChevronLeftIcon className="size-4" />
      Wstecz
    </Button>
  ),
  decorators: [darkWrapper],
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <Button size="xs">Mini</Button>
      <Button size="default">Small</Button>
      <Button size="lg">Default</Button>
      <Button size="xl">Large</Button>
      <Button size="2xl">Extra Large</Button>
    </div>
  ),
}
