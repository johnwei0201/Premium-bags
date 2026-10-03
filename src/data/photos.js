// 包款照片清單（首頁、包款展示共用）
// 目前先用這 5 張輪流展示，之後拿到更多照片，加在這裡就好
import bagPhotoA from '../images/set/3a7f8885-20cf-4230-b95e-9913b9e7207f-2.jpg' // 藍粉托特包
import bagPhotoB from '../images/set/3a7f8885-20cf-4230-b95e-9913b9e7207f-3.jpg' // 酒紅水桶包
import bagPhotoC from '../images/set/3a7f8885-20cf-4230-b95e-9913b9e7207f-4.jpg' // 黑色手提包
import bagPhotoD from '../images/set/3a7f8885-20cf-4230-b95e-9913b9e7207f-1.jpg' // 咖啡色斜背包
import bagPhotoE from '../images/set/3a7f8885-20cf-4230-b95e-9913b9e7207f.jpg' // 米白後背包

export const bagPhotos = [bagPhotoA, bagPhotoB, bagPhotoC, bagPhotoD, bagPhotoE]

// 第 n 張（從 0 開始）要用哪張照片：照片用完就從頭輪一次
export const photoAt = (n) => bagPhotos[n % bagPhotos.length]
