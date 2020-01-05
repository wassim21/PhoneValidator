export interface Country {
    name: string;
    dialCode: string;
    countryCode: string;
}

export enum OutputFormat {
    e164 = 'e164',
    input = 'input',
    international = 'international',
    national = 'national',
    rfc3966 = 'rfc3966'
}
