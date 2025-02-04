-- Add new columns to volunteers table
alter table public.volunteers add column if not exists
  emergency_contacts jsonb default '[]',
  certifications jsonb default '[]',
  background_checks jsonb default '[]',
  past_experiences jsonb default '[]',
  profile_image text,
  bio text,
  address jsonb default '{
    "street": "",
    "city": "",
    "state": "",
    "postal_code": "",
    "country": ""
  }',
  preferences jsonb default '{
    "notifications": {
      "email": true,
      "sms": false
    },
    "privacy": {
      "show_email": false,
      "show_phone": false
    }
  }'; 