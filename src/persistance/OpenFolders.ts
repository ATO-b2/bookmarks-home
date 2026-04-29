class OpenFoldersDAO {
    private static readonly key = "open-folders";

    static async get(): Promise<string[]> {
        let data = Object.values(await browser.storage.local.get(this.key)).at(0);
        return data ? JSON.parse(data) : [];
    }

    static async put(value: string[]) {
        let data = JSON.stringify(value);
        return await browser.storage.local.set({[this.key]: data});
    }
}

export {OpenFoldersDAO}