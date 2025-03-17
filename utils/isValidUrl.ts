export default function isValidUrl(str: string): boolean {
    const pattern = new RegExp("^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z0-9]{2,}(\S*)?$");
    return pattern.test(str);
}