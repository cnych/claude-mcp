'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export function ServerFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const capabilities = [
    { id: 'resources', label: 'Resources' },
    { id: 'tools', label: 'Tools' },
    { id: 'prompts', label: 'Prompts' },
  ];

  const handleCapabilityChange = (capability: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentCapabilities = params.getAll('capabilities');
    
    if (currentCapabilities.includes(capability)) {
      params.delete('capabilities');
      currentCapabilities
        .filter(cap => cap !== capability)
        .forEach(cap => params.append('capabilities', cap));
    } else {
      params.append('capabilities', capability);
    }
    
    router.push(`/servers?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Capabilities</h3>
        <div className="space-y-2">
          {capabilities.map(cap => (
            <label key={cap.id} className="flex items-center">
              <input
                type="checkbox"
                checked={searchParams.getAll('capabilities').includes(cap.id)}
                onChange={() => handleCapabilityChange(cap.id)}
                className="mr-2"
              />
              {cap.label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
} 