
export class ApiFeatures {
    constructor (mongooseQuery, queryData) {
        this.mongooseQuery = mongooseQuery;
        this.queryData = queryData;
    }

    paginate () {
        let {page, limit} = this.queryData

        if (!page || typeof page !== 'number' || page < 1) page = 1
        if (!limit || typeof limit !== 'number' || limit < 1) limit = 3

        const skip = (page - 1) * limit
        this.mongooseQuery.limit(limit).skip(skip)
        return this
    }

    search () {
        if (this.queryData.search) {
            this.mongooseQuery.find({
                $or: [
                    {firstName: {$regex: this.queryData.search}},
                    {lastName: {$regex: this.queryData.search}}
                ]
            })
        }
        return this
    }

    sort () {
        if (this.queryData.sort) {
            this.mongooseQuery.sort(this.queryData.sort.replace(',', " "))
        }
        return this
    }

}