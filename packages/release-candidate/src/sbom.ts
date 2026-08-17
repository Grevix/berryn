export interface SbomComponent {
  name: string;
  version: string;
  purl: string;
  license: string;
}

export interface CycloneDxSbom {
  bomFormat: 'CycloneDX';
  specVersion: '1.5';
  version: 1;
  metadata: {
    timestamp: string;
    component: SbomComponent;
  };
  components: SbomComponent[];
}

export function generateSbomJson(packageName: string, version: string, dependencies: Record<string, string>): CycloneDxSbom {
  const components: SbomComponent[] = Object.entries(dependencies).map(([name, ver]) => ({
    name,
    version: ver,
    purl: `pkg:npm/${name}@${ver.replace('^', '')}`,
    license: 'MIT'
  }));

  return {
    bomFormat: 'CycloneDX',
    specVersion: '1.5',
    version: 1,
    metadata: {
      timestamp: new Date().toISOString(),
      component: {
        name: packageName,
        version,
        purl: `pkg:npm/${packageName}@${version}`,
        license: 'MIT'
      }
    },
    components
  };
}
