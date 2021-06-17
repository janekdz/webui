export enum NSSInfoType {
  SFU = 'SFU',
  SFU20 = 'SFU20',
  RFC2307 = 'RFC2307',
}

export interface ActiveDirectoryUpdate {
  domainname: string;
  bindname: string;
  bindpw: string;
  verbose_logging: boolean;
  use_default_domain: boolean;
  allow_trusted_doms: boolean;
  allow_dns_updates: boolean;
  disable_freenas_cache: boolean;
  restrict_pam: boolean;
  site: string;
  kerberos_realm: number;
  kerberos_principal: string;
  timeout: number;
  dns_timeout: number;
  nss_info: NSSInfoType;
  createcomputer: string;
  netbiosname: string;
  netbiosname_b: string;
  netbiosalias: string[];
  enable: boolean;
}
