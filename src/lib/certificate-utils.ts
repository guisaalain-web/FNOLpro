export type CompanyBranding = {
    name: string;
    primaryColor: string;
    secondaryColor: string;
    logoUrl?: string;
};

export const COMPANIES: Record<string, CompanyBranding> = {
    MAPFRE: {
        name: "MAPFRE",
        primaryColor: "#E30613", // Red
        secondaryColor: "#FFFFFF",
    },
    ALLIANZ: {
        name: "Allianz",
        primaryColor: "#003781", // Blue
        secondaryColor: "#FFFFFF",
    },
    AXA: {
        name: "AXA",
        primaryColor: "#00008F", // Dark Blue
        secondaryColor: "#FFFFFF",
    },
    OCCIDENT: {
        name: "Occident",
        primaryColor: "#E6007E", // Pink/Magenta
        secondaryColor: "#FFFFFF",
    },
    GENERIC: {
        name: "Seguros Global",
        primaryColor: "#3b82f6", // Default Blue
        secondaryColor: "#FFFFFF",
    },
};

export function getCompanyBranding(companyName?: string | null): CompanyBranding {
    if (!companyName) return COMPANIES.GENERIC;
    const key = companyName.toUpperCase();

    if (COMPANIES[key]) {
        return COMPANIES[key];
    }

    // If not a recognized brand, use generic colors but keep the user's provider name
    return {
        ...COMPANIES.GENERIC,
        name: companyName // Keep the name as typed but maybe capitalize it nicely
    };
}

export function generateCertificateHTML(user: any, company: CompanyBranding) {
    const date = new Date().toLocaleDateString();
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Insurance Certificate - ${user.name}</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
            body { font-family: 'Inter', sans-serif; color: #1f2937; line-height: 1.6; background-color: #f3f4f6; margin: 0; padding: 0; }
            .container { 
                max-width: 800px; 
                margin: 40px auto; 
                background: white;
                padding: 60px; 
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                position: relative;
                border-radius: 8px;
                overflow: hidden;
            }
            .top-bar {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 8px;
                background-color: ${company.primaryColor};
            }
            .header { 
                display: flex; 
                justify-content: space-between; 
                align-items: center; 
                margin-bottom: 60px;
                padding-bottom: 20px;
                border-bottom: 1px solid #e5e7eb;
            }
            .logo { font-size: 28px; font-weight: 800; color: ${company.primaryColor}; letter-spacing: -0.025em; }
            .date-box { text-align: right; }
            .date-label { font-size: 10px; color: #6b7280; text-transform: uppercase; font-weight: 600; }
            .date-value { font-weight: 600; font-size: 14px; }
            
            .certificate-title { 
                text-align: center; 
                font-size: 32px; 
                font-weight: 800;
                margin-bottom: 10px; 
                color: #111827;
                letter-spacing: -0.025em;
            }
            .certificate-subtitle {
                text-align: center;
                color: #6b7280;
                margin-bottom: 50px;
                font-size: 16px;
            }

            .section { margin-bottom: 40px; }
            .section-title { 
                font-size: 12px;
                font-weight: 700; 
                text-transform: uppercase; 
                letter-spacing: 0.05em;
                margin-bottom: 15px; 
                color: ${company.primaryColor};
                display: flex;
                align-items: center;
            }
            .section-title::after {
                content: "";
                flex: 1;
                height: 1px;
                background: #e5e7eb;
                margin-left: 15px;
            }

            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
            .item-label { color: #6b7280; font-size: 11px; text-transform: uppercase; font-weight: 600; margin-bottom: 4px; }
            .item-value { font-weight: 600; font-size: 16px; color: #111827; }
            
            .badge {
                display: inline-flex;
                align-items: center;
                padding: 4px 12px;
                border-radius: 9999px;
                font-size: 12px;
                font-weight: 600;
                background-color: #ecfdf5;
                color: #065f46;
            }

            .footer { 
                margin-top: 60px; 
                padding-top: 30px;
                border-top: 1px solid #e5e7eb; 
                font-size: 12px; 
                color: #9ca3af; 
                text-align: center; 
            }
            .stamp { 
                position: absolute; 
                bottom: 120px; 
                right: 60px; 
                width: 140px; 
                height: 140px; 
                border: 2px dashed ${company.primaryColor}; 
                border-radius: 50%; 
                display: flex; 
                flex-direction: column;
                align-items: center; 
                justify-content: center; 
                transform: rotate(-15deg); 
                color: ${company.primaryColor}; 
                font-weight: 800; 
                opacity: 0.15; 
                font-size: 14px;
                text-align: center;
                pointer-events: none; 
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="top-bar"></div>
            <div class="header">
                <div class="logo">${company.name.toUpperCase()}</div>
                <div class="date-box">
                    <div class="date-label">Issue Date</div>
                    <div class="date-value">${date}</div>
                </div>
            </div>
            
            <h1 class="certificate-title">Certificate of Insurance</h1>
            <p class="certificate-subtitle">Official coverage verification and policy status document</p>
            
            <div class="section">
                <div class="section-title">Insurant Information</div>
                <div class="grid">
                    <div>
                        <div class="item-label">Policyholder Name</div>
                        <div class="item-value">${user.name}</div>
                    </div>
                    <div>
                        <div class="item-label">Verified Email</div>
                        <div class="item-value">${user.email}</div>
                    </div>
                </div>
            </div>

            <div class="section">
                <div class="section-title">Policy Coverage Details</div>
                <div class="grid">
                    <div>
                        <div class="item-label">Coverage Plan</div>
                        <div class="item-value">Standard Plus (Commercial & Private)</div>
                    </div>
                    <div>
                        <div class="item-label">Policy Status</div>
                        <div><span class="badge">ACTIVE / VERIFIED</span></div>
                    </div>
                </div>
                <p style="font-size: 14px; color: #4b5563; margin-top: 20px;">
                    This document serves as proof that the individual named above is protected under our comprehensive insurance network, 
                    covering liabilities, property damage, and personal security according to the terms of the main contract.
                </p>
            </div>

            <div class="section">
                <div class="section-title">Provider Confirmation</div>
                <div style="background-color: #f9fafb; padding: 20px; border-radius: 6px; border: 1px solid #e5e7eb;">
                    <p style="margin: 0; font-size: 14px; font-weight: 600;">Issued by: ${company.name} Insurance Group, S.A.</p>
                    <p style="margin: 5px 0 0 0; font-size: 13px; color: #6b7280;">Security Token: ${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
                </div>
            </div>

            <div class="stamp">
                VERIFIED<br>SYSTEM<br>GENUINE
            </div>

            <div class="footer">
                &copy; ${new Date().getFullYear()} ${company.name} Insurance Group. All rights reserved.<br>
                This is an encrypted electronic document and does not require a physical signature.
            </div>
        </div>
    </body>
    </html>
    `;
}
