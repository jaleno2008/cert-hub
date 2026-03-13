import { z } from "zod";

export const CertStatus = z.enum(["NOT_STARTED","IN_PROGRESS","SUBMITTED","APPROVED","DENIED"]);

export const CreateBusinessInput = z.object({
  legalName: z.string().min(2),
  ein: z.string().optional(),
  naics: z.string().optional(),
  address1: z.string().optional(),
  address2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().length(2).optional(),
  zip: z.string().optional(),
  minorityOwned: z.boolean().default(false),
  womanOwned: z.boolean().default(false),
  veteranOwned: z.boolean().default(false)
});

export const StartCertificationInput = z.object({
  businessId: z.string().uuid(),
  certificationId: z.string().uuid()
});
