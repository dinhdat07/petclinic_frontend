import { Owner, Pet } from '../../types';

interface PetDetailsProps {
  owner: Owner;
  pet: Pet;
}

const PetDetails = ({ owner, pet }: PetDetailsProps) => (
  <table className="table table-striped">
    <thead>
      <tr>
        <th>Name</th>
        <th>Birth Date</th>
        <th>Type</th>
        <th>Owner</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>{pet.name}</td>
        <td>{pet.birthDate}</td>
        <td>{pet.type.name}</td>
        <td>
          {owner.firstName} {owner.lastName}
        </td>
      </tr>
    </tbody>
  </table>
);

export default PetDetails;
