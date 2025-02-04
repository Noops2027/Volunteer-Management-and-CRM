export interface Organization {
  id: string;
  name: string;
  description?: string;
  website?: string;
  logo_url?: string;
  contact_email: string;
  contact_phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: 'admin' | 'coordinator' | 'staff';
  status: 'active' | 'inactive';
  created_at: string;
}

export interface OrganizationVolunteer {
  id: string;
  organization_id: string;
  volunteer_id: string;
  status: 'pending' | 'active' | 'inactive';
  joined_at: string;
  created_at: string;
}

export interface OrganizationRelationship {
  id: string;
  parent_org_id: string;
  child_org_id: string;
  relationship_type: 'partner' | 'subsidiary' | 'affiliate';
  created_at: string;
} 