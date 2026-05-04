import { buildEmailSignature } from '../utils/company/signature';

export type MessageType = 'gmail' | 'mail' | 'copy' | 'whatsapp' | 'sms';

type WelcomeParams = {
  customerName: string;
  customerEmail: string;
  projectName: string;
  companyName: string;
  companyAbn: string;
  companyLicence: string;
  companyEmail: string;
  companyPhone: string;
  portalUrl: string;
  tempPassword: string;
  type: MessageType;
};

export function buildWelcomeMessage(p: WelcomeParams): string {
  const { customerName, customerEmail, projectName, companyName, companyAbn, companyLicence, companyEmail, companyPhone, portalUrl, tempPassword, type } = p;

  if (type === 'whatsapp' || type === 'sms') {
    return [
      `Hi ${customerName},`, '', `Welcome to ${companyName}! Your project "${projectName}" is set up.`, '',
      `View & download your quotation here: ${portalUrl}`, '', `Login: ${customerEmail}`, `Temp password: ${tempPassword}`, '',
      `Questions? Call ${companyPhone} or reply here.`, '', `— ${companyName}`,
    ].join('\n');
  }

  const lines = [
    '─────────────────────────────────────────────',
    `  ${companyName}`, `  ABN: ${companyAbn}  |  ${companyLicence}`,
    `  📞 ${companyPhone}  |  ✉️ ${companyEmail}`,
    '─────────────────────────────────────────────', '',
    `Dear ${customerName},`, '',
    `Thank you for choosing ${companyName}. We're delighted to welcome you and look forward to bringing your project to life.`, '',
    `Your project "${projectName}" has been created in our system and we're ready to begin preparing your detailed quotation.`, '', '',
    'YOUR PROJECT', '─────────────',
    `  📋  Project:   ${projectName}`, `  👥  Client:    ${customerName}`, `  ✉️  Email:     ${customerEmail}`, '', '',
    'YOUR ONLINE PORTAL', '──────────────────',
    `We've set up a personal online portal where you can manage everything related to your project.`, '',
    `  🌐  Portal:     ${portalUrl}`, `  ✉️  Login:      ${customerEmail}`, `  🔐  Password:   ${tempPassword}`, '',
    'Please log in and update your password on your first visit.', '', '',
    'WHAT HAPPENS NEXT', '──────────────────',
    "  1.  We'll conduct a thorough assessment of your requirements",
    "  2.  A detailed quotation will be prepared and sent to your portal",
    "  3.  You'll receive a notification when it's ready to view",
    "  4.  Review the quotation, then approve or request changes",
    "  5.  Once approved, we'll schedule and keep you updated", '', '',
    'THROUGH YOUR PORTAL YOU CAN', '────────────────────────────',
    '  ✔  View and download quotation or variation documents',
    '  ✔  Review a full breakdown of the scope of works',
    '  ✔  Approve quotes with a digital signature',
    '  ✔  Request a revised quotation',
    '  ✔  Track variations and changes to scope',
    '  ✔  View progress photos and stage updates',
    '  ✔  Comunicate directly with your project team', '', '',
    ...buildEmailSignature({
      id: 'segal-build', name: companyName, abn: companyAbn, licence: companyLicence,
      email: companyEmail, phone: companyPhone, websiteUrl: 'https://www.segalbuild.com.au',
      logoUrl: '', defaultOverheadPercent: 12, defaultProfitPercent: 15,
    }),
    '─────────────────────────────────────────────',
  ];

  return lines.join('\n');
}
