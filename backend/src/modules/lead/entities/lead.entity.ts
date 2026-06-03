export type LeadType = "inquiry" | "request";
export type LeadStatus = "new" | "contacted" | "resolved";

export interface LeadProps {
  id: string | null;
  name: string;
  phone: string;
  email?: string | null;
  message?: string | null;
  purpose: string;
  type: LeadType;
  status?: LeadStatus;
  classId?: string | null;
  syllabusId?: string | null;
  className?: string | null;
  syllabusName?: string | null;
}

export class Lead {
  public readonly id: string | null;
  public readonly name: string;
  public readonly phone: string;
  public readonly email: string | null;
  public readonly message: string | null;
  public readonly purpose: string;
  public readonly type: LeadType;
  public readonly status: LeadStatus;
  public readonly classId: string | null;
  public readonly syllabusId: string | null;
  public readonly className: string | null;
  public readonly syllabusName: string | null;

  constructor(props: LeadProps) {
    this.id = props.id;
    this.name = props.name;
    this.phone = props.phone;
    this.email = props.email ?? null;
    this.message = props.message ?? null;
    this.purpose = props.purpose;
    this.type = props.type;
    this.status = props.status ?? "new";
    this.classId = props.classId ?? null;
    this.syllabusId = props.syllabusId ?? null;
    this.className = props.className ?? null;
    this.syllabusName = props.syllabusName ?? null;
  }

  updateStatus(status: LeadStatus): Lead {
    return new Lead({ ...this, status });
  }
}
