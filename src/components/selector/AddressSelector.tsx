import { useState, useEffect } from 'react'
import axios from 'axios'
import { provinceOptions } from '../../constants/address.constant'

const apiUrl =
  'https://vietnam-administrative-division-json-server-swart.vercel.app'
const apiEndpointDistrict = apiUrl + '/district/?idProvince='
const apiEndpointWard = apiUrl + '/ward/?idDistrict='

interface Address {
  province: string
  district: string
  ward: string
}

interface District {
  idDistrict: string
  name: string
}

interface Ward {
  idWard: string
  name: string
}

async function getDistrict(idProvince: string): Promise<District[]> {
  const { data: districtList } = await axios.get(
    apiEndpointDistrict + idProvince
  )
  return districtList
}

async function getWard(idDistrict: string): Promise<Ward[]> {
  const { data: wardList } = await axios.get(apiEndpointWard + idDistrict)
  return wardList
}

const AddressSelector = ({
  address,
  setAddress
}: {
  address: Address
  setAddress: (address: Address) => void
}) => {
  const [districtList, setDistrictList] = useState<District[]>([])
  const [wardList, setWardList] = useState<Ward[]>([])
  const [isLoadingDistrict, setIsLoadingDistrict] = useState(false)
  const [isLoadingWard, setIsLoadingWard] = useState(false)

  useEffect(() => {
    if (address.province) {
      setIsLoadingDistrict(true)
      getDistrict(address.province).then((districts) => {
        setDistrictList(districts)
        setIsLoadingDistrict(false)
      })
    } else {
      setDistrictList([])
      setWardList([])
    }
  }, [address.province])

  useEffect(() => {
    if (address.district) {
      setIsLoadingWard(true)
      getWard(address.district).then((wards) => {
        setWardList(wards)
        setIsLoadingWard(false)
      })
    } else {
      setWardList([])
    }
  }, [address.district])

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAddress({
      ...address,
      province: e.target.value,
      district: '',
      ward: ''
    })
  }

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAddress({ ...address, district: e.target.value, ward: '' })
  }

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAddress({ ...address, ward: e.target.value })
  }

  return (
    <div>
      <div className='col-12'>
        <label htmlFor='province'>Tỉnh/Thành phố</label>
        <select
          id='province'
          onChange={handleProvinceChange}
          value={address.province}
        >
          <option value=''>Chọn tỉnh/thành phố</option>
          {provinceOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className='col-12'>
        <label htmlFor='district'>Quận/Huyện</label>
        <select
          id='district'
          onChange={handleDistrictChange}
          value={address.district}
          disabled={!address.province || isLoadingDistrict}
        >
          <option value=''>Chọn quận/huyện</option>
          {districtList.map((district) => (
            <option key={district.idDistrict} value={district.idDistrict}>
              {district.name}
            </option>
          ))}
        </select>
      </div>
      <div className='col-12'>
        <label htmlFor='ward'>Xã/Phường</label>
        <select
          id='ward'
          onChange={handleWardChange}
          value={address.ward}
          disabled={!address.district || isLoadingWard}
        >
          <option value=''>Chọn xã/phường</option>
          {wardList.map((ward) => (
            <option key={ward.idWard} value={ward.idWard}>
              {ward.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default AddressSelector
