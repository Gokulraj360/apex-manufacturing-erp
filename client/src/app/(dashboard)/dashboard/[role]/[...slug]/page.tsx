'use client';

import React from 'react';
import { GenericModuleWorkspace } from '@/components/GenericModuleWorkspace';

export default function RoleModuleCatchAllPage({
  params,
}: {
  params: { role: string; slug: string[] };
}) {
  const role = params?.role;
  const slug = params?.slug;

  return (
    <GenericModuleWorkspace role={role} slug={slug} />
  );
}
