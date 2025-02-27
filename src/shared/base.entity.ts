export interface BaseEntityProps {
  id: string;
  createdAt: Date;
}

export abstract class BaseEntity {
  protected readonly id: BaseEntityProps['id'];
  protected readonly createdAt: BaseEntityProps['createdAt'];

  constructor(data: BaseEntityProps) {
    Object.assign(this, data);
  }

  abstract serialize(): Record<string, unknown>;

  getId(): string {
    return this.id;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }
}
