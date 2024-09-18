rclone sync --exclude=".*" --progress --s3-no-check-bucket --s3-chunk-size=256M data/boundaries r2://fieldmaps-data-cod/boundaries
rclone sync --exclude=".*" --progress --s3-no-check-bucket --s3-chunk-size=256M data/images r2://fieldmaps-data-cod/images
rclone sync --exclude=".*" --progress --s3-no-check-bucket --s3-chunk-size=256M data/reports r2://fieldmaps-data-cod/reports
rclone sync --exclude=".*" --progress --s3-no-check-bucket --s3-chunk-size=256M data/tables r2://fieldmaps-data-cod/tables
