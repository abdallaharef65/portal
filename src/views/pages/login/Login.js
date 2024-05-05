import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { addData, selectDataByParam } from '../../../helper'
import { addInstance, deleteInstance, getInstance, updateInstance } from '../../../helper/instacnes'
import { useNavigate } from 'react-router-dom'
const Login = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [falgValidation, setFalgValidation] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmitLogInData = async () => {
    try {
      setFalgValidation(true)
      if (username && password) {
        let resUser = await addData('login', { email: username.trim(), password: password })

        if (resUser.data.success) {
          // console.log(resUser.data)
          console.log(resUser.data.data)
          //token
          getInstance.defaults.headers['x-access-token'] = resUser.data.token
          deleteInstance.defaults.headers['x-access-token'] = resUser.data.token
          updateInstance.defaults.headers['x-access-token'] = resUser.data.token
          addInstance.defaults.headers['x-access-token'] = resUser.data.token
          resUser = {
            ...resUser.data.data,
            jwt_token: resUser.data.token,
          }

          localStorage.setItem('UserData', JSON.stringify(resUser))
          const param = `role_id=${resUser.role_id}`
          let resScreen = await selectDataByParam('role_screens', param)
          localStorage.setItem('userScreens', JSON.stringify(resScreen.data))
          // navigate('/dashboard')
          const paramRole = `id=${resUser.role_id}`
          const resRole = await selectDataByParam('role', paramRole)
          console.log(resRole)

          if (resRole.no_of_records > 0) {
            // const resMainPage = await selectDataById('screens', resRole.data[0].main_page_id)
            const paramMainPage = `id=${resRole.data[0].main_page_id}`
            const resMainPage = await selectDataByParam('screens', paramMainPage)
            console.log(resMainPage)
            if (resMainPage.no_of_records > 0) {
              console.log(resMainPage.data[0].screen_route)
              navigate(`/${resMainPage.data[0].screen_route}`)
            }
          }
        } else {
          setErrorMessage('Invalid username or password')
        }
      }
    } catch (error) {
      console.error(error.message)
    }
  }
  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={5}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Username"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </CInputGroup>
                    {falgValidation && !username && <p style={{ color: 'red' }}>Required field</p>}
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </CInputGroup>
                    {falgValidation && !password && <p style={{ color: 'red' }}>Required field</p>}
                    <CRow>{errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}</CRow>

                    <CRow>
                      <CCol xs={6}>
                        <CButton
                          color="primary"
                          className="px-4"
                          onClick={() => handleSubmitLogInData()}
                        >
                          Login
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
