define([], function () {
    return function () {
        this.process = function () {
            return [
                {
                    filePath: 'path1',
                    content: 'content1'
                },
                {
                    filePath: 'path2',
                    content: 'content2'
                }
            ];
        }
    };
});