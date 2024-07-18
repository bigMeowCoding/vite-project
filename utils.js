function getI18N() {
    const paths = globby.sync(I18N_GLOB);
    const langObj = paths.reduce((prev, curr) => {
        const filename = curr
            .split('/')
            .pop()
            .replace(/\.tsx?$/, '');
        if (filename.replace(/\.tsx?/, '') === 'index') {
            return prev;
        }

        const fileContent = getLangData(curr);
        let jsObj = fileContent;

        if (Object.keys(jsObj).length === 0) {
            console.log(`\`${curr}\` 解析失败，该文件包含的文案无法自动补全`);
        }

        return {
            ...prev,
            [filename]: jsObj
        };
    }, {});
    return langObj;
}
