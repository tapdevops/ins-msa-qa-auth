/*
    SELECT 
        * 
    FROM 
        TR_FINDING 
    WHERE 
        FINDING_CODE IN ( "A", "B", "C" )
*/
db.getCollection('TR_FINDING').aggregate([
    {
        $match: {
            FINDING_CODE: {
                $in: [ "A", "B", "C" ]
            }
        }
    }
]);
   
/* 
    SELECT 
        BLOCK_INSPECTION_CODE, 
        WERKS, 
        AFD_CODE, 
        BLOCK_CODE 
    FROM 
        TR_BLOCK_INSPECTION_H
*/
db.getCollection('TR_FINDING').aggregate([
    {
        $project: {
            _id: 0,
            BLOCK_INSPECTION_CODE: 1,
            WERKS: 1,
            AFD_CODE: 1,
            BLOCK_CODE: 1
        }
    }
]);

/*
    SELECT 
        BLOCK_INSPECTION_CODE, 
        WERKS, 
        AFD_CODE, 
        BLOCK_CODE 
    FROM 
        TR_BLOCK_INSPECTION_H 
    WHERE 
        AFD_CODE IN ( "A", "B" ) 
        AND INSPECTION_DATE <= 20190701 
        AND INSPECTION_DATE <= 20190731
*/
db.getCollection('TR_BLOCK_INSPECTION_H').aggregate([
    {
        $match: {
            AFD_CODE: {
                $in: [ "A", "B" ]
            },
            INSPECTION_DATE: {
                $gte: 20190701,
                $lte: 20190731
            }
        }
    },
    {
        $project: {
            _id: 0,
            BLOCK_INSPECTION_CODE: 1,
            WERKS: 1,
            AFD_CODE: 1,
            BLOCK_CODE: 1
        }
    }
]);

/*
    SELECT 
        BLOCK_INSPECTION_CODE, 
        WERKS, 
        AFD_CODE, 
        BLOCK_CODE 
    FROM 
        TR_BLOCK_INSPECTION_H 
    WHERE 
        AFD_CODE IN ( "A", "B" ) 
        AND INSPECTION_DATE <= 20190701 
        AND INSPECTION_DATE <= 20190731 
    LIMIT 1
*/
db.getCollection('TR_BLOCK_INSPECTION_H').aggregate([
    {
        $match: {
            AFD_CODE: {
                $in: [ "A", "B" ]
            },
            INSPECTION_DATE: {
                $gte: 20190701,
                $lte: 20190731
            }
        }
    },
    {
        $project: {
            _id: 0,
            BLOCK_INSPECTION_CODE: 1,
            WERKS: 1,
            AFD_CODE: 1,
            BLOCK_CODE: 1
        }
    },
    {
        $limit: 1
    }
]);

/*
SELECT
    A.BLOCK_INSPECTION_CODE,
    A.INSPECTION_DATE,
    B.BLOCK_INSPECTION_CODE_D,
    B.CONTENT_INSPECTION_CODE
FROM
    TR_BLOCK_INSPECTION_H A
    LEFT JOIN TR_BLOCK_INSPECTION_D B ON A.BLOCK_INSPECTION_CODE = B.BLOCK_INSPECTION_CODE
*/
db.getCollection('TR_BLOCK_INSPECTION_H').aggregate([
    {
        "$lookup": {
            "from": "TR_BLOCK_INSPECTION_D",
            "localField": "BLOCK_INSPECTION_CODE",
            "foreignField": "BLOCK_INSPECTION_CODE",
            "as": "B"
        }
    },
    {
        $project: {
            _id: 0,
            BLOCK_INSPECTION_CODE: 1,
            INSPECTION_DATE: 1,
            B.BLOCK_INSPECTION_CODE_D: 1,
            B.CONTENT_INSPECTION_CODE: 1
        }
    }
]);