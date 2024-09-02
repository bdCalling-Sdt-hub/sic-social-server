/* eslint-disable @typescript-eslint/no-explicit-any */
export const fileType = (values: any) => {
    const type = values.split('/')[0]
    return type
}