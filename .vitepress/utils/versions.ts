export const versions = {
    v3: {
        text: 'Version 3',
        prefix: '/v3/'
    },
    v4: {
        text: 'Version 4',
        prefix: '/v4/'
    },
    master: {
        text: 'Master',
        prefix: '/master/'
    }
}

export function switchVersion(
    version: string,
    currentPath: string
) {
    const cleanPath =
        currentPath.replace(
            /^\/(v\d+|master)/,
            ''
        )

    return `/${version}${cleanPath}`
}