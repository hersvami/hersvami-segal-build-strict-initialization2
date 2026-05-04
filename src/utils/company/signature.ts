import type { Company } from '../../types/domain';

const GOOGLE_REVIEW_URL = 'https://g.page/r/CaKlbMKAsPesEAI/review';
const FACEBOOK_URL = 'https://www.facebook.com/SegalAndCo';
const INSTAGRAM_URL = 'https://www.instagram.com/Segalbuild/';

export function buildEmailSignature(company: Company): string[] {
  const website = company.websiteUrl || 'https://www.segalbuild.com.au';

  return [
    'Kind regards,',
    '',
    'James Segal',
    company.name,
    `BPC Registrations: ${company.licence}`,
    `m: ${company.phone}`,
    `e: ${company.email}`,
    `w: ${website}`,
    `ABN: ${company.abn}`,
    '',
    'Are you happy with the service you have received from our team?',
    `If you have a minute, please share a Google review here: ${GOOGLE_REVIEW_URL}`,
    '',
    'Segal Build is a word-of-mouth referral business.',
    'We appreciate you recommending our services to people you know.',
    '',
    `Facebook: ${FACEBOOK_URL}`,
    `Instagram: ${INSTAGRAM_URL}`,
    '',
    'Confidentiality notice: This e-mail message may contain confidential or legally privileged information and is intended only for the use of the intended recipient(s). Any unauthorised disclosure, dissemination, distribution or copying is prohibited. E-mails are not secure and cannot be guaranteed to be error free as they can be intercepted, amended, or contain viruses. Segal Build Pty Ltd is not responsible for errors or omissions in this message and denies responsibility for any damage arising from the use of e-mail.',
  ];
}

export function buildShortSignature(company: Company): string[] {
  return [
    `- ${company.name}`,
    `${company.phone} | ${company.email}`,
    company.websiteUrl || 'https://www.segalbuild.com.au',
  ];
}
