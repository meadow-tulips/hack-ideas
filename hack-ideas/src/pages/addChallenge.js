import { useCallback, useContext, useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import RichTextEditor from "../components/RichTextEditor";
import Input, { StyledLabel } from "../components/Input";
import MultiSelect from "../components/MultiSelect";
import { ChallengesContext } from "../contexts/challengesContext";
import { useNavigate } from "react-router-dom";

const StyledAddNewChallenge = styled.section`
    text-align: left;
    padding: 0 2rem;
    margin-top: -4rem;
`
const StyledCustomLabel = styled(StyledLabel)`
    font-weight: 300;
    font-size:.85rem;
    margin-bottom: 5px;
    ${({ subLabel }) => subLabel && `
        font-size: .75rem;
    `}
`

const StyledInput = styled(Input)`
    input {
        min-width: 100%;
    }
`

const StyledSubmit = styled(Input)`
    margin: 2rem 0;
`

const Error = styled.p`
    color: red;
    text-align: center;
    font-size: .75rem;
    padding-top: 1.2rem;
`


const AddChallenge = () => {
    const [title, updateTitle] = useState('');
    const [description, updateDescription] = useState('');
    const [tags, updateTags]= useState([]);
    const [error, updateError] = useState('');


    const _challengesContext = useContext(ChallengesContext);
    const { postChallenge, getAllTags, availableTags } = _challengesContext;
    const navigate = useNavigate();

    const options = useMemo(() => availableTags.map(tag => ({ label: tag.name, value: tag.name })), [availableTags])

    useEffect(() => {
        getAllTags();
    }, [getAllTags])

    const handleTitleChange = useCallback((event) => {
        const { value } = event.target ;
        updateTitle(value);
    }, [updateTitle]);

    const handleTagsChange = useCallback((values) => {
        updateTags(values);
    }, [updateTags])

    const handleSubmit = useCallback((event) => {
        event.preventDefault();
        const formData =  {
            tags: tags.map(item => item.value),
            title,
            description
        }
        postChallenge(formData)
        .then(_ => {
            navigate("/dashboard", { replace: true })
        }).catch(err => {
            updateError(err.error.message);
        })
    }, [tags, title, description, postChallenge, updateError, navigate]);

    const handleDraftjsChange = useCallback((editorState) => {
        updateDescription(JSON.stringify(editorState || {}));
    }, [updateDescription])

    return <StyledAddNewChallenge>
            <h3>Add a new Challenge</h3>
        
            <form onSubmit={handleSubmit}>
                <StyledInput value={title} label={<>
                <StyledCustomLabel>Title</StyledCustomLabel>
                <StyledCustomLabel subLabel>Be specific and imagine you're asking a question to another person.</StyledCustomLabel>
                </>} name='title' onChange={handleTitleChange} placeholder="Appropriate title"   />

                <StyledCustomLabel style={{ marginBottom: '.5rem'}}>Description</StyledCustomLabel>
                <RichTextEditor value={description} handleChange={handleDraftjsChange} />

                <StyledCustomLabel style={{ marginTop: "2rem", marginBottom: "1rem"}}>Tags</StyledCustomLabel>
                <MultiSelect onChange={handleTagsChange} name='tags' value={tags} options={options} />
                {error ? <Error>{error}</Error> : null}
                <StyledSubmit type="submit" value="Post Challenge" />
            </form>
    </StyledAddNewChallenge>
}

export default AddChallenge;