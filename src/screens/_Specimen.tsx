import React, { useState } from 'react';
import { Button } from '../ds/Button';
import { IconButton } from '../ds/IconButton';
import { Badge } from '../ds/Badge';
import { Tag } from '../ds/Tag';
import { Avatar } from '../ds/Avatar';
import { Card } from '../ds/Card';
import { StatCard } from '../ds/StatCard';
import { FeatureChip } from '../ds/FeatureChip';
import { Tabs } from '../ds/Tabs';
import { Dialog } from '../ds/Dialog';
import { Toast } from '../ds/Toast';
import { Tooltip } from '../ds/Tooltip';
import { Input } from '../ds/Input';
import { Select } from '../ds/Select';
import { Switch } from '../ds/Switch';
import { Checkbox } from '../ds/Checkbox';
import { GradientText } from '../ds/GradientText';
import { Logo } from '../ds/Logo';
import { Search, Settings, Zap, BarChart2, Package, DollarSign, Bell } from '../ds/icons';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section style={{ marginBottom: 48 }}>
    <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 20, paddingBottom: 10, borderBottom: '1px solid var(--border-default)' }}>{title}</h2>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-start' }}>{children}</div>
  </section>
);

export default function Specimen() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState('overview');
  const [switchOn, setSwitchOn] = useState(false);
  const [checkboxOn, setCheckboxOn] = useState(false);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px', background: 'var(--surface-page)', minHeight: '100vh' }}>
      <div style={{ marginBottom: 48 }}>
        <Logo variant="color" height={36} />
        <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 28, fontWeight: 700, color: 'var(--text-strong)', marginTop: 24 }}>
          <GradientText>Citisoft</GradientText> Design System
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>Component specimen — all primitives in all variants</p>
      </div>

      <Section title="Logo">
        <div style={{ background: 'var(--surface-card)', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
          <Logo variant="color" height={32} />
        </div>
        <div style={{ background: 'var(--slate-900)', padding: 16, borderRadius: 'var(--radius-md)' }}>
          <Logo variant="white" height={32} />
        </div>
        <div style={{ background: 'var(--surface-card)', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
          <Logo variant="slate" height={32} />
        </div>
      </Section>

      <Section title="Buttons — variants">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="primary" accent="rfq">RFQ accent</Button>
      </Section>

      <Section title="Buttons — sizes">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
        <Button disabled>Disabled</Button>
        <Button fullWidth variant="secondary" style={{ maxWidth: 240 }}>Full width</Button>
      </Section>

      <Section title="Buttons — with icons">
        <Button leadingIcon={<Search size={16} />}>Search</Button>
        <Button trailingIcon={<Bell size={16} />} variant="secondary">Notifications</Button>
      </Section>

      <Section title="Icon Buttons">
        <IconButton icon={<Settings size={18} />} label="Settings" variant="brand" />
        <IconButton icon={<Settings size={18} />} label="Settings" variant="secondary" />
        <IconButton icon={<Settings size={18} />} label="Settings" variant="ghost" />
        <IconButton icon={<Settings size={18} />} label="Settings" disabled />
      </Section>

      <Section title="Badges">
        <Badge tone="brand">Brand</Badge>
        <Badge tone="neutral">Neutral</Badge>
        <Badge tone="success">Success</Badge>
        <Badge tone="warning">Warning</Badge>
        <Badge tone="error">Error</Badge>
        <Badge tone="rfq">RFQ</Badge>
        <Badge tone="success" solid>Solid success</Badge>
        <Badge tone="brand" dot>With dot</Badge>
      </Section>

      <Section title="Tags">
        <Tag>Default</Tag>
        <Tag active>Active</Tag>
        <Tag icon={<Package size={14} />}>With icon</Tag>
        <Tag onRemove={() => {}}>Removable</Tag>
      </Section>

      <Section title="Avatars">
        <Avatar name="Umair Ahmed" size="xs" />
        <Avatar name="John Doe" size="sm" />
        <Avatar name="Sarah K" size="md" />
        <Avatar name="Mike Chen" size="lg" />
        <Avatar name="Bob" size="md" square />
      </Section>

      <Section title="Cards">
        <Card style={{ width: 220 }}>
          <p style={{ color: 'var(--text-body)', fontSize: 14 }}>Default card with standard shadow.</p>
        </Card>
        <Card elevated style={{ width: 220 }}>
          <p style={{ color: 'var(--text-body)', fontSize: 14 }}>Elevated card with medium shadow.</p>
        </Card>
        <Card interactive style={{ width: 220 }}>
          <p style={{ color: 'var(--text-body)', fontSize: 14 }}>Interactive — hover for lift effect.</p>
        </Card>
      </Section>

      <Section title="StatCards">
        <StatCard label="Total Revenue" value="$142k" unit="USD" delta="12% vs last week" deltaDir="up" icon={<DollarSign size={16} />} accent style={{ width: 200 }} />
        <StatCard label="Active RFQs" value="38" delta="4 new today" deltaDir="up" icon={<Package size={16} />} style={{ width: 200 }} />
        <StatCard label="Avg. Turnaround" value="4.2" unit="hrs" delta="1.8 hrs slower" deltaDir="down" style={{ width: 200 }} />
      </Section>

      <Section title="FeatureChips">
        <FeatureChip icon={<Zap size={22} />} title="Instant quotes" style={{ maxWidth: 320 }}>
          Get competitive quotes from verified suppliers in under 4 hours.
        </FeatureChip>
        <FeatureChip icon={<BarChart2 size={22} />} title="Analytics" accent="rfq" style={{ maxWidth: 320 }}>
          Track spend, compliance, and supplier performance in one dashboard.
        </FeatureChip>
      </Section>

      <Section title="Tabs">
        <div style={{ width: '100%' }}>
          <Tabs
            tabs={[
              { value: 'overview', label: 'Overview', count: 12 },
              { value: 'rfqs', label: 'RFQs', count: 4 },
              { value: 'suppliers', label: 'Suppliers' },
              { value: 'settings', label: 'Settings' },
            ]}
            value={tabValue}
            onChange={setTabValue}
          />
        </div>
      </Section>

      <Section title="Dialog">
        <Button onClick={() => setDialogOpen(true)}>Open dialog</Button>
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          title="Confirm action"
          footer={
            <>
              <Button variant="secondary" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => setDialogOpen(false)}>Confirm</Button>
            </>
          }
        >
          Are you sure you want to submit this RFQ? It will be sent to all qualified suppliers immediately.
        </Dialog>
      </Section>

      <Section title="Toasts">
        <Toast tone="info" title="RFQ submitted" onDismiss={() => {}} duration={0}>Your request has been sent to 12 suppliers.</Toast>
        <Toast tone="success" title="Quote accepted" onDismiss={() => {}} duration={0} />
        <Toast tone="warning" title="Deadline approaching" onDismiss={() => {}} duration={0}>3 quotes expire in 2 hours.</Toast>
        <Toast tone="error" title="Submission failed" onDismiss={() => {}} duration={0}>Please check your network connection.</Toast>
      </Section>

      <Section title="Tooltips">
        <Tooltip label="This is a tooltip" placement="top">
          <Button variant="secondary">Hover me (top)</Button>
        </Tooltip>
        <Tooltip label="Bottom tooltip" placement="bottom">
          <Button variant="secondary">Hover (bottom)</Button>
        </Tooltip>
        <Tooltip label="Left side" placement="left">
          <Button variant="secondary">Hover (left)</Button>
        </Tooltip>
        <Tooltip label="Right side" placement="right">
          <Button variant="secondary">Hover (right)</Button>
        </Tooltip>
      </Section>

      <Section title="Inputs">
        <Input label="Email address" placeholder="you@company.com" containerStyle={{ minWidth: 260 }} />
        <Input label="Search" placeholder="Search RFQs..." leadingIcon={<Search size={16} />} containerStyle={{ minWidth: 260 }} />
        <Input label="With error" placeholder="Enter value" error="This field is required" containerStyle={{ minWidth: 260 }} />
        <Input label="Small" size="sm" placeholder="Small input" containerStyle={{ minWidth: 200 }} />
        <Input label="Disabled" placeholder="Cannot edit" disabled containerStyle={{ minWidth: 200 }} />
      </Section>

      <Section title="Select">
        <Select
          label="Priority"
          options={['Low', 'Medium', 'High', 'Critical']}
          containerStyle={{ minWidth: 220 }}
        />
        <Select
          label="With error"
          options={[{ value: '', label: 'Choose...' }, { value: 'a', label: 'Option A' }]}
          error="Please select an option"
          containerStyle={{ minWidth: 220 }}
        />
      </Section>

      <Section title="Switch">
        <Switch label="Notifications" checked={switchOn} onChange={(v) => setSwitchOn(v)} />
        <Switch label="Dark mode (sm)" size="sm" defaultChecked />
        <Switch label="Disabled" disabled />
        <Switch label="Disabled on" disabled checked />
      </Section>

      <Section title="Checkbox">
        <Checkbox label="I agree to terms" checked={checkboxOn} onChange={(v) => setCheckboxOn(v)} />
        <Checkbox label="Pre-checked" defaultChecked />
        <Checkbox label="Disabled" disabled />
        <Checkbox label="Disabled checked" disabled checked />
      </Section>

      <Section title="GradientText">
        <GradientText style={{ fontSize: 32, fontWeight: 700 }}>Brand gradient</GradientText>
        <GradientText accent="rfq" style={{ fontSize: 32, fontWeight: 700 }}>RFQ gradient</GradientText>
        <GradientText as="h2" style={{ fontSize: 24, fontWeight: 700 }}>As H2 element</GradientText>
      </Section>
    </div>
  );
}
