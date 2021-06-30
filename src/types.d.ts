export interface Addon {
  id: string,
  name: string,
  provider: AddonProvider,
  plan: AddonPlan,
  creationDate: Date | number | string,
}

interface AddonProvider {
  name: string,
  logoUrl: string,
}

interface AddonPlan {
  name: string,
}

export interface BackupDetails {
  providerId: string,
  passwordForCommand: string,
  list: Backup[],
}

export interface Backup {
  createdAt: Date,
  expiresAt: Date
  url: string,
  restoreCommand: string,
  deleteCommand: string,
}
