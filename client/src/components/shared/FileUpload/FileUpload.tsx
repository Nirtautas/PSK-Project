import { Button } from '@mui/material'
import { CloudUpload as CloudUploadIcon} from '@mui/icons-material'

import styles from './FileUpload.module.scss'
import { placeholderImageUrl } from '@/constants/placeholders'
import ImageIcon from '@mui/icons-material/Image';

type Props = {
    imageUrl: string
    errorMsg?: string
    image: File | null
    onUpload: (file: File) => void
}
const FileUpload = ({ imageUrl, errorMsg, image, onUpload }: Props) => (
    <div className={styles.image_section}>
        <div className={styles.upload}>
           <img src={imageUrl || placeholderImageUrl} alt="img" />
            <Button startIcon={<CloudUploadIcon />} variant="contained" component="label" sx={{ margin: 'auto 0 auto auto' }}>
                Upload Image
                <input type="file" hidden onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpload(e.target.files![0])} accept="image/*" />
            </Button>
        </div>
        {errorMsg
            ? <p className={styles.error}>{errorMsg}</p>
            : image && <p>{image.name}</p>
        }
    </div>
)

export default FileUpload