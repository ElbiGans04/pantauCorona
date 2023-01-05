import styled from "styled-components"

export default function NurHafidzah () {
    return (
        <Container>
            <h1>Nur Hafidzah Safitri</h1>
            <p>Halo Semua, Nama saya adalah Nur Hafidzah Safitri, Saya adalah seorang mahasiswa. Saya Senang belajar akan hal baru
                , Salam Kenal Semua {":)"}
            </p>
        </Container>
    )
}

const Container = styled.div`
    width: 100%;
    margin: 20px 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;